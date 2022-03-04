import { createInterface as createReadlineInterface } from "readline"

export async function shellInput(question: string): Promise<string> {
  const readline = createReadline()
  return new Promise((resolve: Function) => {
    readline.question(question, answer => {
      readline.close()
      resolve(answer)
    })
  })
}

export async function booleanShellInput({
  question,
  yesAnswer,
  noAnswer,
  showInputVariants
}: {
  question: string
  yesAnswer?: string
  noAnswer?: string
  showInputVariants?: boolean
}): Promise<boolean> {
  yesAnswer = yesAnswer ?? "y"
  noAnswer = noAnswer ?? "n"
  showInputVariants = showInputVariants ?? true
  const validInput = [yesAnswer, noAnswer]

  if (showInputVariants) {
    const inputVariants = `[${yesAnswer}/${noAnswer}]: `
    question = `${question} ${inputVariants}`
  }

  while (true) {
    let currentInput = await shellInput(question)
    currentInput = currentInput.toLowerCase()

    const isValidInput = validInput.includes(currentInput)
    if (isValidInput === false) {
      continue
    }

    return currentInput === yesAnswer
  }
}

export async function newPasswordInput(): Promise<string> {
  const newPassword = await shellInput("New password: ")
  return newPassword
}

export async function newPasswordInputWithConfirm(): Promise<string> {
  let newPassword: string
  while (true) {
    const newPasswordCandidate = await newPasswordInput()
    const passwordConfirmation = await shellInput("Confirm password: ")

    if (newPasswordCandidate === passwordConfirmation) {
      newPassword = newPasswordCandidate
      break
    }

    console.log("Passwords dont match")
  }

  return newPassword
}

function createReadline() {
  return createReadlineInterface({
    input: process.stdin,
    output: process.stdout
  })
}
