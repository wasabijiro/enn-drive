// @ts-ignore
export default function formatCreatedAt(createdAt) {
    // 日付オブジェクトを作成
    const date = new Date(createdAt);

    // オプションを定義
    const options = {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: true
    };

    // 現在の日付を取得
    const now = new Date();
    const today = now.toDateString();
    const dateStr = date.toDateString();

    // 日付をフォーマット
    // @ts-ignore
    let formattedDate = date.toLocaleDateString('en-US', options);

    // 日付が今日の場合は 'today' を使う
    if (today === dateStr) {
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        formattedDate = `today ${timeStr}`;
    } else {
        // 'MM/DD/YYYY, HH:MM AM/PM' 形式に変換
        formattedDate = formattedDate.replace(/(\d+)\/(\d+)\/(\d+),/, '$3/$1/$2');
    }

    return formattedDate;
}