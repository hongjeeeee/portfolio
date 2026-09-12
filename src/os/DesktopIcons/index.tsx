import { finderFolders } from '@/config/notes';
import { useOS } from '@/store/os';
import { FolderGlyph } from '../icons';
import { notesIn } from '../notes';
import s from './style.module.css';

// 추가: [바탕화면 폴더] · 목록은 src/config/notes.ts
const DesktopIcons = () => {
  const { showProject } = useOS.getState();

  return (
    <div className={s.layer}>
      {finderFolders.map((f) => (
        <button
          key={f.id}
          type="button"
          className={s.item}
          title={`${notesIn(f.id).length}개 항목`}
          onClick={() => showProject(f.id)}
        >
          <FolderGlyph className={s.icon} />
          <span className={s.name}>{f.title}</span>
        </button>
      ))}
    </div>
  );
};

export default DesktopIcons;
