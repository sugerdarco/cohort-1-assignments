/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npm run test-anagram`
*/

function isAnagram(str1, str2) {
    //remove non-alphabetic character
    str1 = str1.replace(/\s/g, '').toLowerCase();
    str2 = str2.replace(/\s/g, '').toLowerCase();

    console.log(str1, str2);

    // if length are not equal, they connot anagrams
    if (str1.length !== str2.length) {
        return false;
    }
    return str1.split('').sort().join('') === str2.split('').sort().join('');
}

export { isAnagram };
