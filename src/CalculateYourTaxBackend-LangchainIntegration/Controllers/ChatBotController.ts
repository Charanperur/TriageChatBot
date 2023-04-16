const { SingletonChatBot } = require('../LangchainLLm/index.js');
var router = require('express').Router();

const chatBot = new SingletonChatBot().getInstance();

router.post('/askQuestion', async (req: { body: { question: any; }; }, res: { json: (arg0: any) => void; }) => {
    const question = req.body.question;
    const response = await chatBot.askQuestion(question);
    res.json(response);
});

module.exports = router;
