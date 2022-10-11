const hexToBinary  = require("hex-to-binary");
const {GENESIS_DATA, MINE_RATE} = require('./config');
const cryptoHash = require('./crypto-hash');
class Block{
    constructor({timestamp, prevHash, hash, data, nonce, difficulty}){
        this.timestamp = timestamp;
        this.prevHash = prevHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;

    }
    static genesis(){
        return new this(GENESIS_DATA);
    }

    static mineBlock({prevBlock, data}){
        let hash, timestamp;

        const prevHash = prevBlock.hash;
        let {difficulty} = prevBlock;
        let nonce = 0;
        do{
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({orignalBlock : prevBlock, timestamp
            })
            hash = cryptoHash(timestamp, prevHash, data, nonce, difficulty);
        }while(hexToBinary(hash).substring(0,difficulty)!=='0'.repeat(difficulty));
        return new this ({
            
            timestamp, 
            prevHash, 
            data,
            difficulty, 
            nonce,
            hash
        });
    }

    static adjustDifficulty(orignalBlock, timestamp){
        const {difficulty} = orignalBlock;
        if(difficulty< 1) return 1;
        const diffrence = timestamp - orignalBlock.timestamp;
        if(diffrence> MINE_RATE) return difficulty - 1;
        return difficulty + 1;
    }
}


const block1 = new Block({
    timestamp: '2/09/22', 
    prevHash: "0xabc", 
    hash: "0xc12", 
    data: 'test block 1'
});

const block2 = new Block({timestamp: '10/11/22',prevHash: "0xasc", hash: "0xb12", data: 'test block 2'});


// console.log(block1);
// console.log(block2);

// const genesisBlock = Block.genesis();
// console.log(genesisBlock);

// const result = Block.mineBlock({prevBlock: block1 , data: "block2"});
// console.log(result);


module.exports = Block;