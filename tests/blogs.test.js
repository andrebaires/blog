const mongoose = require('mongoose');
const Page = require('./helpers/page');

let page;

beforeEach(async () => {
	page = await Page.build();
	await page.goto('http://localhost:3000');
});

afterEach(async () => {
	await new Promise(resolve => setTimeout(resolve, 100));
	await page.close();
});

afterAll(async () => {
	await mongoose.disconnect();
});

test('Blogs', async () => {

});