Clone the git repository
Create a file named as .env and enter following test data first in the file: 
EMAIL=Lolita.Ryan@gmail.com
PASSWORD=8g_VlhyUFlF6Jha
USERNAME=Rylan
Open the project and then on terminal run the command `npm install`
Run the project by using command   `npx playwright test --headed`
If want to run in a headless mode, use command  `npx playwright test`
To view the report of the tests, use command   `npx playwright show-report`


[Important]: The reason of adding initial test data in .env file is that the tests are run in parallel in playwright as per the configuration set in the project. Running the login tests without populating the credentials file would cause them to fail. 
