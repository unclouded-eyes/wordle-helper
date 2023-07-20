const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function solveWordle(wordle) {
    let restrictedAlphabet = ALPHABET.filter((element) => {
        return !wordle.excludedChars.includes(element);
    });
    return getPossibleSolutions(wordle.word, wordle.knownChars, restrictedAlphabet);
}

function getPossibleSolutions(word, knownChars, restrictedAlphabet) {
    let permutationArr = knownChars;
    nullCount = 0;
    for(let i = 0; i < word.length; i++) {
        if (word[i] === null) {
            nullCount++;
            if (nullCount > knownChars.length) {
                permutationArr.push(null);
            }
        }
    }
    let result = [];
  
    const permute = (arr, m = []) => {
        if (arr.length === 0) {
            resultOption = word.slice();
            permutaionArrIndex = 0;
            for(let i = 0; i < resultOption.length; i++) {
                if (resultOption[i] === null) {
                    resultOption[i] = m[permutaionArrIndex++];
                }
            }
            result.push(resultOption.join(''));
        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                if (next[0] === null) {
                    restrictedAlphabet.forEach((element) => permute(curr.slice(), m.concat(element)));
                    break;
                } else {
                    permute(curr.slice(), m.concat(next));
                }
            }
        }
   }
  
   permute(permutationArr)
  
   return result;
}

wordle = {
    word: ['C', null, null, 'C', null],
    knownChars: ['U', 'O'],
    excludedChars: []
}

solveWordle(wordle);