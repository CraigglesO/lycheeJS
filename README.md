
# lycheeJS (2016-Q1)

brought to you as libre software with joy and pride by [Artificial Engineering](http://artificial.engineering).

Support our libre Bot Cloud via BTC [1CamMuvrFU1QAMebPoDsL3JrioVDoxezY2](bitcoin:1CamMuvrFU1QAMebPoDsL3JrioVDoxezY2?amount=0.5&label=lycheeJS%20Support).



## Overview

The following repositories are related to the lycheeJS project:

- [lycheeJS-bundle](https://github.com/Artificial-Engineering/lycheeJS-bundle.git) generates all OS-ready bundles.
- [lycheeJS-future](https://github.com/Artificial-Engineering/lycheeJS-future.git) contains concepts and ideas not yet finished.
- [lycheeJS-runtime](https://github.com/Artificial-Engineering/lycheeJS-runtime.git) contains all pre-compiled runtimes used by the Fertilizers.
- [lycheeJS-tutorial](https://github.com/Artificial-Engineering/lycheeJS-tutorial.git) generates all OS-ready tutorials.
- [lycheeJS-website](https://github.com/Artificial-Engineering/lycheeJS-website.git) contains the lycheeJS website.


lycheeJS is a Next-Gen Isomorphic Application Engine that
offers a complete solution for prototyping and deployment
of applications. The underlying technology stack does not
matter (HTML5, WebGL, OpenGL, OpenGLES, libSDL) and is
completely automated behind the scenes.

The project aims to ease up and automate the design and
development process of applications through intelligent
software bots that learn from your application code.

The development process is optimized for Blink-based
browsers (Chromium, Google Chrome, Opera) and their
developer tools.

The target platforms are described as so-called Fertilizers.
Those Fertilizers cross-compile everything automagically
using a serialized `lychee.Environment` that is setup in
each project's or library's `lychee.pkg` file.


| Target       | Fertilizer                   | Package  | arm | amd64 |
|:-------------|:-----------------------------|:---------|:---:|:-----:|
| Browser      | html                         |          |  ✓  |   ✓   |
| Linux        | html-nwjs, node, node-sdl    | bin      |  ✓  |   ✓   |
| OSX          | html-nwjs, node              | app, bin |     |   ✓   |
| Windows      | html-nwjs, node              |          |     |   ✓   |
| Android      | html-webview, node, node-sdl | apk, bin |  ✓  |   ✓   |
| BlackberryOS | html-webview, node, node-sdl | apk, bin |  ✓  |   ✓   |
| FirefoxOS    | html-webview                 | zip      |  ✓  |   ✓   |
| iOS          | html                         |          |     |       |
| Ubuntu Touch | html-webview, node, node-sdl | deb, bin |  ✓  |   ✓   |

The iOS Fertilizer has currently no support for cross-compilation
due to XCode limitations. You can still create an own WebView iOS
app and use the `html` platform adapter.

lycheeJS does not ship x86 (32 bit) runtimes in order to save hard disk
space. If you still have an old x86 computer you have to modify at least
[node/update.sh](https://github.com/Artificial-Engineering/lycheeJS-runtime/blob/master/node/update.sh)
script in the `./bin/runtime` folder and execute it once before
starting the `lycheejs-harvester`.



## Install lycheeJS (Developer Machine)

The native bundles (such as a Debian or OSX package or the lycheeOS
image) are being deprecated, but can be built by anyone using the
[lycheeJS-bundle](https://github.com/Artificial-Engineering/lycheeJS-bundle)
repository.

The netinstall shell script allows to automatically install
lycheeJS on any UNIX-compatible machine (arm, x86 or amd64).

The only requirements beforehand are working `bash`, `git` and `curl`.

```bash
# This will clone lycheejs into /opt/lycheejs

sudo bash -c "$(curl -fsSL http://lycheejs.org/install.sh)";
```

The above commands will look similar to this if everything went fine.

![Install lycheeJS](./guides/asset/readme-netinstall.gif)



## Bootup lycheeJS (Developer Machine)

After you've installed lycheeJS, you can directly start the `lycheejs-harvester`.

The `./bin/configure.sh` script has to be executed initially one time as `root` in
order to compile down all the lycheeJS core libraries and to symlink the `lycheejs-`
tools correctly into `/usr/local/bin`.

We try to support as much package managers as possible inside the `./bin/configure.sh`,
but if your package manager isn't supported please let us know.

If you want a sandboxed installation without the awesome system-wide integration of
the `lycheejs-` tools, you can use the `--sandbox` flag.

```bash
cd /opt/lycheejs;

sudo ./bin/configure.sh;              # --sandbox if you want a sandboxed installation
lycheejs-harvester start development; # --sandbox if you want a sandboxed harvester
```

The above commands will look similar to this if everything went fine.

![Bootup lycheeJS](./guides/asset/readme-bootup.gif)


## Guides

These are the guides that should help you to get started as easy as possible.

Please let us know if we can improve anything in these documents [by opening an Issue directly on GitHub](https://github.com/Artificial-Engineering/lycheeJS/issues/new).  

- [Contribution Guide](./guides/CONTRIBUTION.md)
- [Codestyle Guide](./guides/CODESTYLE.md)
- [ECMAScript Guide](./guides/ECMASCRIPT.md)
- [Release Guide](./guides/RELEASE.md)


## License

lycheeJS is (c) 2012-2016 Artificial-Engineering and released under MIT / Expat license.
The projects and demos are licensed under CC0 (public domain) license.
The runtimes are owned and copyrighted by their respective owners and may be shipped under a different license.

For further details take a look at the [LICENSE.txt](LICENSE.txt) file.

