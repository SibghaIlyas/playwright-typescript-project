import { test, expect, type Page } from '@playwright/test';
import dotenv from 'dotenv';
import { generateRandCredentials, signUp } from '../utils/commonFunctions';
import * as faker from 'faker';
dotenv.config();

test.describe.serial('Login & enroll', () => {
    let context;
    let page: Page;
    let email: string;
    let password: string;
    let username: string;
    

    test.beforeAll(async ({ browser }) => {
        username = faker.name.firstName();
        email = faker.internet.email();
        password = faker.internet.password();
        console.log(email + " " + password );
        context = await browser.newContext();
        page = await context.newPage();
        await signUp(page, username, email, password, "Uttarakhand", "Female")
        let successPopup = page.locator("div[role='alert']");
        await expect(successPopup).toHaveText("Signup successfully, Please login!")
        await page.goto('/login');
    });

    test('2. Login with created credentials', async () => {
       
        
        const emailLocator = await page.getByPlaceholder('Email')
        const pwdLocator = await page.getByPlaceholder('Password')
        const submiteLocator = await page.getByRole( 'button', {name: 'Sign in'})
        const welcomeMsg = await page.locator(".welcomeMessage")
        
        await emailLocator.fill(email);
        await pwdLocator.fill(password);
        await submiteLocator.waitFor({state: 'visible'})
        await submiteLocator.click();
        await expect(welcomeMsg).toHaveText("Welcome " + username + " to Learn Automation Courses")

    })


    test('3. Enroll 3 courses', async () => {
        const enrolBtn = await page.getByRole( 'button', {name: 'Enroll Now'})
        const addressArea = await page.locator("#address");
        const phone = await page.locator("#phone");
        const finalEnrol = await page.locator("//button[@class = 'action-btn' and contains(text(), 'Enroll Now')]");
        const courseCount = await page.locator(".count"); 
        const cartBtn = await page.getByRole( 'button', {name: 'Cart'})
        let totalPriceOfCourses = 0;

        const courses = ['Cypress' , 'Selenium', 'Playwright'];
        let coursesPrice: number = 0;
       
        for (const course of courses ) {
            let cLocator = await page.locator("//h2[contains(text(),'" + course + "')]/../following-sibling::button");
            await cLocator.click();
            let cPrice: string = (await (page.locator("//h2[contains(text(),'"+course+"')]/../following-sibling::span/b").textContent()))?.toString() || '';
            // await page.getByRole('generic').filter({hasText: 'Cypress'}).getByRole("button", {name: / Add to Cart /}).click();
            let actualPrice = cPrice.split('₹').at(1) || '';
            totalPriceOfCourses = totalPriceOfCourses + parseInt(actualPrice,10);

        }

        await expect(courseCount).toHaveText('3');
        await cartBtn.first().click();
        console.log(totalPriceOfCourses);
        const priceOnPage = await page.getByRole('heading', {name: "Total Price"}).innerText();
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