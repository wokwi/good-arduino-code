## GoodArduinoCode.com

## Getting Started

If you just want to get the code running as quickly as possible,
without any setup on your computer, [open the project in CodeSandbox](https://githubbox.com/wokwi/good-arduino-code).

If you prefer to set up a local development environment, clone the repository:

```bash
git clone https://github.com/wokwi/good-arduino-code
```

Then run `npm install` to install all the dependencies.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Adding new code examples

Create a new directory under the `content` directory, and then create the following files inside:

- `project.json` - This file describes your project. You can see an example [here](content/simon/project.json).
- `README.md` - the description of the project
- `sketch.ino` - the Arduino source code of your project

As soon as you create these two files, you should see
the new example appear in the homepage.

Note: the name of the directory will become part of the URL of your example. For instance, if you call the
directory `smart-bin`, the project will be published
as `https://goodarduinocode.com/projects/smart-bin`.

## License

The code is released under the terms of [The MIT License](LICENSE). The code examples and related assets are covered by [CC-BY-SA](https://creativecommons.org/licenses/by-sa/4.0/),
with the following exception: you may use portions of code from the examples in your Arduino project without sharing your entire source code.
