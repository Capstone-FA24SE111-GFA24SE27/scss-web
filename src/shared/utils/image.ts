import { validImageTypes } from "../services";

export async function checkImageUrl(url: string) {
	if (url.trim() === '') return false;
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) return true;

	try {
		const res = await fetch(url);
		const buff = await res.blob();

		return validImageTypes.includes(buff.type);
	} catch (err) {
		console.log(err)
		return false
	}
}
