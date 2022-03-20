export default function GetPost(res) {
    const data = res.data?.children?.[0]?.data;
    if (!data) return;

    const isCrosspost = data.crosspost_parent_list instanceof Array;

    return isCrosspost?

    data.crosspost_parent_list[0]:
    data;
}