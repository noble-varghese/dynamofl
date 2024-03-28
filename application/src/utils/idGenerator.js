/** @format */

const idGenerator = (prefix) => {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let finalPrefix = prefix + "_";

	while (finalPrefix.length < prefix.length + 10) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		finalPrefix += characters.charAt(randomIndex);
	}

	return finalPrefix;
};

module.exports = idGenerator;
