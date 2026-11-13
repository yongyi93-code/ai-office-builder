#!/usr/bin/env python3
"""Validate portable assets and exercise the safe seed operation."""
import importlib.util
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile

sys.dont_write_bytecode = True

ROOT = Path(__file__).resolve().parents[1]

def main():
    errors = []
    forbidden_names = {'.git', '.wrangler', 'node_modules', '.env', '.env.local', '.dev.vars', 'hosting.json'}
    forbidden_suffixes = {'.fbx', '.glb', '.gltf', '.jpg', '.jpeg', '.png', '.sqlite', '.db', '.pem'}
    patterns = [r'sk-[A-Za-z0-9_-]{16,}', r'appgprj_[A-Za-z0-9]{12,}',
                r'[A-Za-z0-9._%+-]+@(?:gmail|googlemail)\.com', r'Bearer\s+[A-Za-z0-9_.-]{20,}']
    assert re.search(patterns[2], 'synthetic' + '@' + 'gmail' + '.com')
    assert re.search(patterns[3], 'Bearer ' + 'a' * 24)
    for p in ROOT.rglob('*'):
        if p.is_symlink(): errors.append('Symbolic link: ' + str(p.relative_to(ROOT)))
        if not p.is_file(): continue
        relative = p.relative_to(ROOT)
        if '__pycache__' in relative.parts: continue
        if set(relative.parts) & forbidden_names or p.suffix.lower() in forbidden_suffixes:
            errors.append('Forbidden bundle file: ' + relative.as_posix())
        if p.suffix.lower() in {'.md', '.mjs', '.tsx', '.ts', '.css', '.yaml', '.py', '.json'}:
            text = p.read_text(encoding='utf-8')
            if any(re.search(pattern, text) for pattern in patterns):
                errors.append('Possible secret or source identity: ' + relative.as_posix())
    entry = ROOT / 'SKILL.md'
    for link in re.findall(r'\]\((references/[^)]+)\)', entry.read_text(encoding='utf-8')):
        if not (ROOT / link).is_file(): errors.append('Missing reference: ' + link)
    scene = ROOT / 'assets/visual-modules/app/office-3d.tsx'
    if not scene.exists() or 'const useLicensedModels=false;' not in scene.read_text(encoding='utf-8'):
        errors.append('Licensed model loading must be disabled by default')
    required = ['lib/floor-layout.mjs', 'lib/amenities-scene.ts', 'lib/office-amenities.mjs', 'tests/floors.test.mjs', 'tests/amenities.test.mjs']
    for relative in required:
        if not (ROOT / 'assets/visual-modules' / relative).is_file(): errors.append('Missing current visual module: ' + relative)
    if not (ROOT / 'references/execution-contract.md').is_file(): errors.append('Missing execution contract')
    scene_text = scene.read_text(encoding='utf-8')
    if 'defaultOfficeView' not in scene_text or 'buildAmenities' not in scene_text: errors.append('Floor/amenities integration missing')
    spec = importlib.util.spec_from_file_location('office_seed', ROOT / 'scripts/seed_visual_modules.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    with tempfile.TemporaryDirectory(prefix='ai-office-skill-check-') as temp:
        destination = Path(temp) / 'seed'
        module.seed(destination)
        manifest = json.loads((destination / '_seed-manifest.json').read_text(encoding='utf-8'))
        assert manifest['backend_connected'] is False
        assert manifest['licensed_models_included'] is False
        assert manifest['template_revision'] == 2
        assert manifest['default_layout']['office_floor'] == 2
        assert manifest['default_layout']['leisure_floor'] == 1
        sentinel = destination / 'owner-file.txt'
        sentinel.write_text('keep me', encoding='utf-8')
        try:
            module.seed(destination)
            errors.append('Nonempty destination was not rejected')
        except ValueError:
            pass
        assert sentinel.read_text(encoding='utf-8') == 'keep me'
        if shutil.which('node'):
            tests = sorted(str(p) for p in (destination / 'tests').glob('*.test.mjs'))
            result = subprocess.run(['node', '--test', *tests], cwd=destination, capture_output=True, text=True, encoding='utf-8')
            if result.returncode: errors.append('Seed behavioral tests failed:\n' + result.stdout + result.stderr)
            else: print('Seed behavioral tests passed')
        else:
            errors.append('Node unavailable: bundled behavioral tests not verified')
    if errors:
        raise SystemExit('\n'.join(errors))
    print('Bundle boundary, references, seed copy, and overwrite protection passed')

if __name__ == '__main__':
    main()
