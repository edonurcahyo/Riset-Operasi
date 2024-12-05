function maxProfit(x, y) {
    const profitX = 15000000; 
    const profitY = 20000000; 
    const timeX = 5; 
    const timeY = 6; 
    const programmerX = 3; 
    const programmerY = 2; 
    const maxProgrammers = 10; 
    const maxTime = 12; 

    const totalTime = x * timeX + y * timeY;
    const totalProgrammers = x * programmerX + y * programmerY;
    const totalProfit = x * profitX + y * profitY;

    if (totalTime > maxTime || totalProgrammers > maxProgrammers) {
        return 0;
    } else {
        return totalProfit;
    }
}

export { maxProfit };
