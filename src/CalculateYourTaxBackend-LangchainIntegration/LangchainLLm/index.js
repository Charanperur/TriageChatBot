const path = require('path');
const { OpenAI } = require('langchain/llms');
const dotenv = require('dotenv');
const { OpenAIEmbeddings } = require('langchain/embeddings');
const { HNSWLib } = require('langchain/vectorstores');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { TextLoader } = require('langchain/document_loaders');
const { loadQAStuffChain } = require('langchain/chains');
const fs = require('fs/promises');
const readline = require('readline');

class GPTChatBot {
    #model;
    #chainA;
    #object;
    constructor() {
        this.#model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.9, model_name: "text-ada-001" });
        this.#chainA = loadQAStuffChain(this.#model);

        if (process.env.NODE_ENV !== 'production') {
            dotenv.config({ path: '../../.env' });
        }
        else {
            dotenv.config({ path: './environments/production.env' });
        }

        this.directory = path.join(__dirname, 'data');
        this.chainA = loadQAStuffChain(this.#model);

    }

    async createVectorEmbeddings() {

        console.log("Loading text files...");
        const loader = new TextLoader("./textfiles/Text1.txt");
        const docs = await loader.load();
        console.log("Text files loaded.");

        console.log("SPlitting text files...");
        const textSplietter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunckOverlap: 100,
        });

        const splittedDocs = await textSplietter.splitDocuments(docs);
        console.log("Text files splitted.");
        // console.log({splittedDocs});

        console.log("Creating vector store...");
        const vectorStore = await HNSWLib.fromDocuments(splittedDocs, new OpenAIEmbeddings());
        await vectorStore.save(this.directory);
        console.log("Vector store created.");
        return vectorStore;
    }

    async pathExists(path) {
        try {
            await fs.access(path);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async loadVectorEmbeddings() {
        console.log("Loading vector store...");

        const loadedVectorStore = await HNSWLib.load(
            this.directory,
            new OpenAIEmbeddings()
        );
        console.log("Vector store loaded.");
        return loadedVectorStore;
    }

    async askQuestion(question) {
       
        if(await this.pathExists(this.directory)){
            var vectorStore = await this.loadVectorEmbeddings();
        } else {
            var vectorStore = await this.createVectorEmbeddings();
        }

        const docs = await vectorStore.similaritySearch(question, 5);
        // console.log({ docs });
        const resp = await this.chainA.call({
            input_documents: docs,
            question: question,
        });

        return resp;

    }
}


// const chainA = loadQAStuffChain(model);

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });



// async function main() {
//     if (await pathExists(directory)) {
//         var vectorStore = await loadVectorEmbeddings();
//     } else {
//         var vectorStore = await createVectorEmbeddings();
//     }


//     let question = "When was new regime announced prior to budget 2023?";




//     const docs = await vectorStore.similaritySearch(question, 5);
//     console.log({ docs });
//     const resp = await chainA.call({
//         input_documents: docs,
//         question: question,
//     });

//     console.log(resp);

//     // console.log("Press any key to exit.");
// }

class SingletonChatBot{
    constructor(){
        if(!SingletonChatBot.instance){
            SingletonChatBot.instance = new GPTChatBot();
        }
    }

    getInstance(){
        return SingletonChatBot.instance;
    }
}

module.exports = { SingletonChatBot }



