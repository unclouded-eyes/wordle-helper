const ALPHABET = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
const correctLetters = [null, null, null, null, null];
const letterOccurances = new Map(ALPHABET.map(letter => [letter, {amount: 0, isExactAmount: false, forbiddenPostions: new Set()}]));

async function wordleHelper(word) {
    updateConstraints(word);
    return findMatchingWords();
}

function updateConstraints(word) {
    let letterAmounts = new Map();
    for (let i = 0; i < word.length; i++) {
        letter = word[i];
        if (letter.state == 2 || letter.state == 3) {
            letterAmounts.set(letter.value, (letterAmounts.get(letter.value) || 0) + 1);
            if (letterOccurances.get(letter.value).amount < letterAmounts.get(letter.value)) {
                letterOccurances.get(letter.value).amount++;
            }
            if (letter.state == 2) {
                letterOccurances.get(letter.value).forbiddenPostions.add(i);
            } else {
                correctLetters[i] = letter.value;
            }
        } else {
            letterOccurances.get(letter.value).isExactAmount = true;
        }
    }
    for (let i = 0; i < correctLetters.length; i++) {
        if (correctLetters[i] != null) {
            letterOccurances.get(correctLetters[i]).amount--;
            letterOccurances.forEach(letterOccurance => {
                letterOccurance.forbiddenPostions.delete(i);
            })
        }
    }
}

async function findMatchingWords() {
    const words = await getFiveLetterWords();
    return words.filter(word => {
        let letterAmounts = new Map();
        for (let i = 0; i < correctLetters.length; i++) {
            if (correctLetters[i] != null) {
                if (correctLetters[i] != word.charAt(i))
                    return false;
            } else {
                if ((letterOccurances.get(word.charAt(i)).isExactAmount == true
                    && letterOccurances.get(word.charAt(i)).amount == 0)
                    || letterOccurances.get(word.charAt(i)).forbiddenPostions.has(i))
                    return false;
                letterAmounts.set(word.charAt(i), (letterAmounts.get(word.charAt(i)) || 0) + 1);
            }
        }
        for (let [key, value] of letterOccurances) {
            if (value.isExactAmount == true
                && value.amount != (letterAmounts.get(key) || 0)) {
                return false;
            } else if ((letterAmounts.get(key) || 0) < value.amount) {
                return false;
            }
        }
        return true;
    });
}

async function getFiveLetterWords() {
    return await fetch("https://raw.githubusercontent.com/unclouded-eyes/wordle-helper/master/sgb-words.txt")
        .then(response => response.text())
        .then(text => text.split("\n"));
}