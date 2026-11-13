#!/usr/bin/env python3
"""Copy the bundled visual-only modules to a new or empty directory."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil

def seed(destination):
    source = Path(__file__).resolve().parents[1] / 'assets' / 'visual-modules'
    files = sorted(p for p in source.rglob('*') if p.is_file())
    if not files:
        raise ValueError('Visual modules are missing')
    if any(p.is_symlink() for p in source.rglob('*')):
        raise ValueError('Bundled symbolic links are not allowed')
    dest_input = Path(destination).expanduser()
    if dest_input.is_symlink():
        raise ValueError('Destination must not be a symbolic link')
    dest = dest_input.resolve()
    if dest.exists() and (not dest.is_dir() or any(dest.iterdir())):
        raise ValueError('Destination must be a new or empty directory; existing files are never overwritten')
    if source == dest or source in dest.parents or dest in source.parents:
        raise ValueError('Destination must be outside the skill assets')
    dest.mkdir(parents=True, exist_ok=True)
    manifest = []
    for path in files:
        relative = path.relative_to(source)
        target = dest / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(path, target)
        manifest.append({'path': relative.as_posix(), 'sha256': hashlib.sha256(target.read_bytes()).hexdigest()})
    (dest / '_seed-manifest.json').write_text(json.dumps({
        'kind': 'visual-modules-only', 'backend_connected': False,
        'licensed_models_included': False, 'default_staff_count': 6, 'template_revision': 2,
        'default_layout': {'office_floor': 2, 'leisure_floor': 1, 'initial_view': 'upper', 'procedural_pets': 2},
        'required_host_dependencies': ['react', 'react-dom', 'typescript', 'three', '@types/three'],
        'files': manifest,
    }, ensure_ascii=False, indent=2), encoding='utf-8')
    return {'destination': str(dest), 'files': len(manifest), 'backend_connected': False}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dest', required=True, help='New or empty destination directory')
    args = parser.parse_args()
    try:
        print(json.dumps(seed(args.dest), ensure_ascii=True))
    except (ValueError, OSError) as error:
        parser.exit(1, str(error) + '\n')

if __name__ == '__main__':
    main()
