import { test, expect, type Page, chromium } from '@playwright/test';
import * as faker from 'faker';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();


test.describe.serial('Create new user account' , ( ) => {

    test('User should be able to create an account with valid fields', async ( {page} ) => {
        let randomName: string = faker.name.firstName();
        let randomEmail: string = faker.internet.email();
        let randomPwd: string = faker.internet.password();
        const envData = `EMAIL=${randomEmail}\nPASSWORD=${randomPwd}\nUSERNAME=${randomName}`;
        fs.writeFileSync('.env', envData);
        const awsInterest = await page.getByLabel('AWS');
        const jmeterInterest = await page.getByLabel('JMETER')
        const gcpInterest = await page.getByLabel('GCP');
        const maleRadio = await page.locator("#gender1");
        const femaleRadio = await page.locator("#gender2");
        const stateDropdown = await page.locator("//select[@id='state']");
        const hobbiesDropdown = await page.locator("//select[@id='hobbies']");
        const signupBtn = await page.getByRole('button', { name: 'Sign Up' });

        await page.goto('https://freelance-learn-automation.vercel.app/signup');
        //verify that i am on Learn Automation Courses page
        await expect(page.getByRole('heading', {name: "Learn Automation Courses"})).toBeVisible();
        await page.getByPlaceholder('Name').fill(randomName);
        await page.getByPlaceholder('Email').fill(randomEmail);
        await page.getByPlaceholder('Password').fill(randomPwd);
        await awsInterest.check();
        await jmeterInterest.check();
        await gcpInterest.check();
        await femaleRadio.check();
        console.log(randomEmail + " " + randomName + " " + randomPwd);
        await stateDropdown.selectOption({ label: 'Uttarakhand' });
        await hobbiesDropdown.selectOption({ label: 'Swimming' });
        await signupBtn.click();
        let successPopup = page.locator("//div[@role='alert']");
        await expect(successPopup).toHaveText("Signup successfully, Please login!")
       
    })

});

