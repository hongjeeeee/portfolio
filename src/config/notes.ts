export interface NoteCategory {
  id: string;
  title: string;
}

/**
 * 메모 목록에서 글을 묶는 분류. 이 순서대로 제목을 달고, 글은 src/content/<id>/ 폴더에 마크다운 파일로 넣는다.
 * 파일 맨 위 머리말(---)에 title · excerpt · link · order 를 적을 수 있다.
 */
export const noteCategories: NoteCategory[] = [
  { id: 'about', title: '소개' },
  { id: 'projects', title: '프로젝트' },
];
