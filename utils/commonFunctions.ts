import {test, expect, type Page} from '@playwright/test';
import * as faker from 'faker';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

export async function signUp(page: Page, username: string, email: string, password: string, state: string, gender: string) {  //can pass interests array here as well, skipping it for now 
  
    const awsInterest = await page.getByLabel('AWS');
    const jmeterInterest = await page.getByLabel('JMETER')
    const gcpInterest = await page.getByLabel('GCP');
    const stateDropdown = await page.locator('select[id="state"]');
    const hobbiesDropdown = await page.locator('select[id="hobbies"]');
    const signupBtn = await page.getByRole('button', { name: 'Sign Up' });

    await page.goto('/signup');
    //verify that i am on Learn Automation Courses page
    await expect(page.getByRole('heading', {name: "Learn Automation Courses"})).toBeVisible();
    await page.getByPlaceholder('Name').fill(username);
    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(password);
    await awsInterest.check();
    await jmeterInterest.check();
    await gcpInterest.check();
    await page.locator(`input[type="radio"][value="${gender}"]`).click();
    await stateDropdown.selectOption({ label: `${state}`});
    await hobbiesDropdown.selectOption({ label: "Swimming" });
    await signupBtn.click();
}

export async function generateRandCredentials() {
   
    let randomName: string = faker.name.firstName();
    let randomEmail: string = faker.internet.email();
    let randomPwd: string = faker.internet.password();
    const envData = `EMAIL=${randomEmail}\nPASSWORD=${randomPwd}\nPW_USERNAME=${randomName}`;
    fs.writeFileSync('.env', envData);
    
}