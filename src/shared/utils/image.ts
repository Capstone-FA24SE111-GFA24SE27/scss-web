export async function checkImageUrl(url: string) {
	if (url.trim() === '') return false;

	try {
		const res = await fetch(url);
		const buff = await res.blob();

		return buff.type.startsWith('image/');
	} catch (err) {
		return false;
	}
}
