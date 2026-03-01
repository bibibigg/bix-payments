// Intl.DateTimeFormat 인스턴스를 모듈 레벨에서 한 번만 생성.
// 렌더마다 인스턴스를 새로 만드는 비용을 제거한다.
const listDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
});

const detailDateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatListDate(dateStr: string): string {
  return listDateFormatter.format(new Date(dateStr));
}

export function formatDetailDate(dateStr: string): string {
  return detailDateFormatter.format(new Date(dateStr));
}
