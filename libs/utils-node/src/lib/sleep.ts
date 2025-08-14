export async function sleep(milliseconds: number) {
  await new Promise((resolve) => setTimeout(() => resolve(true), milliseconds));
}

export async function randomSleep(baseMillis = 1000) {
  const milliseconds = Math.round(Math.random() * baseMillis);
  await sleep(milliseconds);
}
