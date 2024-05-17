import { test, expect, type Page, chromium } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();
import { generateRandCredentials, signUp } from '../utils/commonFunctions';




test.describe('1. Create new user account' , ( ) => {

    test('1. User should be able to create an account with valid fields', async ( {page} ) => {
        await generateRandCredentials();
        const email = process.env.EMAIL || '' ;
        const password = process.env.PASSWORD || '';
        const username = process.env.PW_USERNAME || '';
        console.log(email + " " + password );

        await signUp(page, username, email, password, "Uttarakhand", "Female")
        let successPopup = page.locator("div[role='alert']");
        await expect(successPopup).toHaveText("Signup successfully, Please login!")

       
    })

});

