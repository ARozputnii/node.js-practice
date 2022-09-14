function print(msg="") {
  return console.log(msg)
}

function welcomeMsg() {
  console.clear()
  print("____________________________________________________________________")
  print("For showing chart enter command: './stat chart_name other_params'")
}

const promptWarning =  "Please make correctly command. For showing chart enter command: './stat chart_name other_params'\n" +
  "Chart names are: 'medals' or 'top-teams'"

const property = [
  {
    name: "command",
    validator: /^.\/stat/,
    description: 'Enter command',
    required: true,
    warning: promptWarning
  }
];

export { print, welcomeMsg, promptWarning, property }
