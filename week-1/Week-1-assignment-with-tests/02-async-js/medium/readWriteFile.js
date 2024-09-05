import fs from 'fs';

const readwrite = async () => {
    const data = fs.readFileSync('text.txt', "utf-8");
    await fs.writeFileSync('text.txt', data.replace(/\s+/g, " ").trim(), 'utf8');
}

function formatTime24Hours(date) {
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}
function formatTime12Hours(date) {
    let hours = date.getHours();
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');
    let ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${hours}:${minutes}:${seconds} ${ampm}`;
}

function updateClock() {
    const now = new Date();

    const time24Hours = formatTime24Hours(now);
    const time12Hours = formatTime12Hours(now);

    console.clear();
    console.log("24-Hour Format: ", time24Hours);
    console.log("12-Hour Format", time12Hours);

    setTimeout(updateClock, time24Hours);
}

updateClock();



