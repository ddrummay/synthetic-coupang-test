const GLOBAL_START_TIME = Date.now();

const assert = require('assert');
const By = $selenium.By;
const until = $selenium.until;

function normalizeAssertionText(value) {
    return String(value ?? '').replace(/\s+/g, ' ').trim();
}

async function waitForShadowContextElement(context, locator, timeoutMs) {
    const endTime = Date.now() + timeoutMs;
    let lastError = null;

    while (Date.now() < endTime) {
        try {
            return await context.findElement(locator);
        } catch (error) {
            lastError = error;
        }

        await $webDriver.sleep(250);
    }

    throw lastError || new Error('Timed-out waiting for shadow DOM element');
}

const NR_RECORDER_METADATA = {
    "version": 1,
    "createdBy": "nr-synthetics-recorder",
    "monitorType": "SCRIPT_BROWSER",
    "steps": [
        {
            "ordinal": 0,
            "type": "NAVIGATE",
            "values": [
                "https://www.coupang.com/",
                ""
            ],
            "name": "Navigate to URL"
        },
        {
            "ordinal": 1,
            "type": "CLICK_ELEMENT",
            "values": [
                "//*[@id='quick-category-pc']//a[normalize-space()='로켓직구']"
            ],
            "name": "Click Element"
        },
        {
            "ordinal": 2,
            "type": "CLICK_ELEMENT",
            "values": [
                "//*[@id='quick-category-pc']//a[normalize-space()='로켓배송']"
            ],
            "name": "Click Element"
        },
        {
            "ordinal": 3,
            "type": "CLICK_ELEMENT",
            "values": [
                "//*[@id='wa-mycoupang-link']"
            ],
            "name": "Click Element"
        }
    ]
};

// -- EDIT THIS SECTION TO DEFINE YOUR STEPS --
const STEPS = [
    {
        name: "Navigate to URL",
        nrStep: NR_RECORDER_METADATA.steps[0],
        stepFn: async (obj) => {
        await $webDriver.switchTo().defaultContent();
        await $webDriver.get("https://www.coupang.com/");
        }
    },
    {
        name: "Click Element",
        nrStep: NR_RECORDER_METADATA.steps[1],
        stepFn: async (obj) => {
        await $webDriver.switchTo().defaultContent();
        const element = await $webDriver.findElement(By.xpath("//*[@id='quick-category-pc']//a[normalize-space()='로켓직구']"));
        await element.click();
        }
    },
    {
        name: "Click Element",
        nrStep: NR_RECORDER_METADATA.steps[2],
        stepFn: async (obj) => {
        await $webDriver.switchTo().defaultContent();
        const element = await $webDriver.findElement(By.xpath("//*[@id='quick-category-pc']//a[normalize-space()='로켓배송']"));
        await element.click();
        }
    },
    {
        name: "Click Element",
        nrStep: NR_RECORDER_METADATA.steps[3],
        stepFn: async (obj) => {
        await $webDriver.switchTo().defaultContent();
        const element = await $webDriver.findElement(By.xpath("//*[@id='wa-mycoupang-link']"));
        await element.click();
        }
    }
];


// -- DO NOT EDIT BELOW THIS LINE -- 
async function runSteps() {
    const NUM_STEPS = STEPS.length;

    console.log('===========[ SCRIPT START ]===========');

    let stepNum = 0;
    let stepResult = undefined;

    for (const step of STEPS) {
        const stepStartTime = Date.now();
        stepNum++;

        const stepName = step.name || `Step ${stepNum}`;
        const stepStartTimestamp = new Date().toISOString();
        console.log(`[START] Step ${stepNum} of ${NUM_STEPS}: ${stepName} started: ${stepStartTimestamp}`);

        try {
            stepResult = await step.stepFn(stepResult);
            const stepDuration = Date.now() - stepStartTime;
            console.log(`[END] Step ${stepNum} of ${NUM_STEPS}: ${stepName} ended. Duration: ${stepDuration} ms`);
        } catch (error) {
            $util.insights.set('stepFailureNum', stepNum);
            $util.insights.set('stepFailureName', stepName);
            console.error(`[ERROR] Step ${stepNum} of ${NUM_STEPS}: ${stepName} ->  error: ${error}`);
            throw error;
        }

    }
}

await runSteps();
