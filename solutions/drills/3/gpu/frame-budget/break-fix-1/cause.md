The code added CPU and GPU durations as though they ran serially. They can overlap; the slower side sets frame time against the refresh budget.
