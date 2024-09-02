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

test('The header has the correct text', async () => {
	const text = await page.$eval('a.brand-logo', el => el.innerHTML);

	expect(text).toEqual('Blogster');
});

test('Clicking login starts oauth flow', async () => {
	await page.click('.right a');
	
	const url = await page.url();
	
	expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in, shows logout button', async () => {
	
	await page.login();
	const text = await page.getContentsOf('a[href="/auth/logout"]');

	expect(text).toEqual('Logout');
});