const ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

async function main(wordle) {
    const constraints = new Constraints(wordle);
    const possibleSolutions =  await findMatchingWords(constraints);
    console.log(possibleSolutions);
}

function Constraints(wordle) {
    this.correctLetters = [null, null, null, null, null];
    this.letterOccurances = new Map(ALPHABET.map(letter => [letter, {amount: 0, isExactAmount: false, forbiddenPostions: new Set()}]));

    for (let i = 0; i < wordle.board.length; i++) {
        let tempLetterOccuranceAmounts = new Map(ALPHABET.map(letter => [letter, 0]));
        for (let j = 0; j < wordle.board[i].length; j++) {
            let currentLetter = wordle.board[i].charAt(j);
            let currentState = wordle.state[i].charAt(j);
            if (currentState == 1 || currentState == 2) {
                tempLetterOccuranceAmounts.set(currentLetter, tempLetterOccuranceAmounts.get(currentLetter)+1);
                if (this.letterOccurances.get(currentLetter).amount < tempLetterOccuranceAmounts.get(currentLetter)) {
                    this.letterOccurances.get(currentLetter).amount++;
                }
                if (currentState == 1) {
                    this.letterOccurances.get(currentLetter).forbiddenPostions.add(j);
                } else if (currentState == 2) {
                    this.correctLetters[j] = currentLetter;
                }
            } else {
                this.letterOccurances.get(currentLetter).isExactAmount = true;
            }
        }
    }

    for (let i = 0; i < this.correctLetters.length; i++) {
        if (this.correctLetters[i] != null) {
            this.letterOccurances.get(this.correctLetters[i]).amount--;
            this.letterOccurances.forEach(letterOccurance => {
                letterOccurance.forbiddenPostions.delete(i);
            })
        }
    }
}

async function findMatchingWords(constraints) {
    const words = await getFiveLetterWords();
    return words.filter(word => {
        let tempLetterOccuranceAmounts = new Map(ALPHABET.map(letter => [letter, 0]));
        for (let i = 0; i < constraints.correctLetters.length; i++) {
            if (constraints.correctLetters[i] != null) {
                if (constraints.correctLetters[i] != word.charAt(i))
                    return false;
            } else {
                if ((constraints.letterOccurances.get(word.charAt(i)).isExactAmount == true
                    && constraints.letterOccurances.get(word.charAt(i)).amount == 0)
                    || constraints.letterOccurances.get(word.charAt(i)).forbiddenPostions.has(i))
                    return false;
                tempLetterOccuranceAmounts.set(word.charAt(i), tempLetterOccuranceAmounts.get(word.charAt(i))+1);
            }
        }
        returnValue = true;
        for (let [key, value] of constraints.letterOccurances) {
            if (value.isExactAmount == true) {
                if (value.amount != tempLetterOccuranceAmounts.get(key)) {
                    returnValue = false;
                    break;
                }
            } else if (tempLetterOccuranceAmounts.get(key) < value.amount) {
                returnValue = false;
                break;
            }
        }
        return returnValue;
    });
}

async function getFiveLetterWords() {
    const response = await fetch("https://raw.githubusercontent.com/unclouded-eyes/wordle-helper/master/sgb-words.txt").then(response => response)
    const text = await response.text()
    const words = text.split("\n");
    words.pop();
    return words;
}

// word is "drill"
wordle = {
    board: ["diary", "skill"],
    state: ["21010", "00222"]   // 0: letter not in word, 1: letter at different position in word, 2: letter correct
}

// word is "trust"
wordle1 = {
    board: ["rears", "sassy", "trees", "attiu"],
    state: ["10001", "00020", "22001", "01101"]   // 0: letter not in word, 1: letter at different position in word, 2: letter correct
}

// word is "strip"
wordle2 = {
    board: ["tssck", "aarip"],
    state: ["11000", "00222"]   // 0: letter not in word, 1: letter at different position in word, 2: letter correct
}

// word is "tardy"
wordle3 = {
    board: ["traps", "terra", "tarot"],
    state: ["21100", "20201", "22200"]   // 0: letter not in word, 1: letter at different position in word, 2: letter correct
}

// word is "codon"
wordle4 = {
    board: ["party"],
    state: ["00000"]   // 0: letter not in word, 1: letter at different position in word, 2: letter correct
}

// word is "codon"
wordle4_1 = {
    board: ["party", "cloud", "condo"],
    state: ["00000", "20101", "22111"]   // 0: letter not in word, 1: letter at different position in word, 2: letter correct
}

// word is "grief"
wordle5 = {
    board: ["diary", "their", "price", "fries", "brief"],
    state: ["01010", "00111", "02201", "12220", "02222"]   // 0: letter not in word, 1: letter at different position in word, 2: letter correct
}

// word is "think"
wordle6 = {
    board: ["plays", "doubt", "white"],
    state: ["00000", "00001", "02210"]   // 0: letter not in word, 1: letter at different position in word, 2: letter correct
}

wordle7 = {
    board: [],
    state: []   // 0: letter not in word, 1: letter at different position in word, 2: letter correct
}

main(wordle6).catch(console.log);