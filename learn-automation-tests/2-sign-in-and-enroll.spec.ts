import { test, expect, type Page, chromium } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test.describe.serial('Login & enroll', () => {
    let context;
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
        await page.goto('https://freelance-learn-automation.vercel.app/login');
    });

    test('Login with created credentials', async () => {
       
        const email = process.env.EMAIL || '' ;
        const password = process.env.PASSWORD || '';
        const username = process.env.PW_USERNAME || '';
        console.log(email + " " + password );
        const emailLocator = await page.getByPlaceholder('Email')
        const pwdLocator = await page.getByPlaceholder('Password')
        const submiteLocator = await page.getByRole( 'button', {name: 'Sign in'})
        const welcomeMsg = await page.locator("//h4[@class='welcomeMessage']")
        
        await page.goto('https://freelance-learn-automation.vercel.app/Login');
        await emailLocator.fill(email);
        await pwdLocator.fill(password);
        await submiteLocator.waitFor({state: 'visible'})
        await submiteLocator.click();
        await expect(welcomeMsg).toHaveText("Welcome " + username + " to Learn Automation Courses")

    })


    test('enroll 3 courses', async () => {
        const enrolBtn = await page.getByRole( 'button', {name: 'Enroll Now'})
        const addressArea = await page.locator("#address");
        const phone = await page.locator("#phone");
        const finalEnrol = await page.locator("//button[@class = 'action-btn' and contains(text(), 'Enroll Now')]");
        const courseCount = await page.locator("//button[@class='cartBtn']/span"); 
        const cartBtn = await page.getByRole( 'button', {name: 'Cart'})
        let totalPriceOfCourses = 0;

        const courses = ['Cypress' , 'Selenium', 'Playwright'];
        let coursesPrice: number = 0;
        await page.goto('https://freelance-learn-automation.vercel.app/');
        for (const course of courses ) {
            let cLocator = await page.locator("//h2[contains(text(),'" + course + "')]/../following-sibling::button");
            await cLocator.click();
            let cPrice: string = (await (page.locator("//h2[contains(text(),'"+course+"')]/../following-sibling::span/b").textContent()))?.toString() || '';
            let actualPrice = cPrice.split('₹').at(1) || '';
            totalPriceOfCourses = totalPriceOfCourses + parseInt(actualPrice,10);

        }
    

        await expect(courseCount).toHaveText('3');
        await cartBtn.first().click();
        console.log(totalPriceOfCourses);
        const priceOnPage : string = (await (page.locator("//button[contains(text(),'Enroll Now')]/../h3/b").textContent()))?.toString() || '';
        await expect(priceOnPage.split('₹').at(1)).toEqual(totalPriceOfCourses.toString());
        await enrolBtn.click();
        await addressArea.fill("test address");
        await phone.fill("03244106836");
        await finalEnrol.click();
        await expect(page.locator('.uniqueId')).toContainText("Your order id is ");

    })

    
    test.afterAll(async () => {
        await context.close();
    });


})