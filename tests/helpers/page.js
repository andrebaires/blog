const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory =  require('../factories/userFactory');

class CustomPage {
	static async build() {
		const browser = await puppeteer.launch({
			headless: false
		});

		await new Promise(resolve => setTimeout(resolve, 100));
		
		const page = await browser.newPage();
		
		await new Promise(resolve => setTimeout(resolve, 100));

		const customPage = new CustomPage(page);

		return new Proxy(customPage, {
			get: function(target, property) {
				return customPage[property] || browser[property] || page[property];
			}
		});
	}
	constructor(page) {
		this.page = page;
	}

	async login() {
		const user = await userFactory();
		const { session, sig } = sessionFactory(user);
		
		await this.page.setCookie({ name: 'express:sess', value: session });	
		await this.page.setCookie({ name: 'express:sess.sig', value: sig });

		await this.page.goto('http://localhost:3000/blogs');
		await this.page.waitForSelector('a[href="/auth/logout"]');
	}

	async getContentsOf(selector) {
		return this.page.$eval(selector, el => el.innerHTML);
	}
}

module.exports = CustomPage;