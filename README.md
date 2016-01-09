
# lycheeJS (2015-Q4)

## Support

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
of HTML5, native OpenGL, native OpenGLES and libSDL2 based
applications.

The project has the goal to ease up development of applications
and shipment to further platforms. The development process is
optimized for Blink-based browsers (Chromium, Google Chrome,
Opera) and their developer tools.

The target platforms are described as so-called Fertilizers.
Those Fertilizers cross-compile everything automagically using
a serialized `lychee.Environment` that is configured in each
`lychee.pkg` file.


| Target       | Fertilizer                   | Package  | arm | amd64 |
|:-------------|:-----------------------------|:---------|:---:|:-----:|
| Browser      | html                         |          |  ✓  |   ✓   |
| Linux        | html-nwjs, node, node-sdl    | bin      |  ✓  |   ✓   |
| OSX          | html-nwjs, node              | app, bin |     |   ✓   |
| Windows      | html-nwjs, node              |          |     |   ✓   |
| Android      | html-webview, node, node-sdl | apk, bin |  ✓  |   ✓   |
| BlackberryOS | html-webview, node, node-sdl | apk, bin |  ✓  |   ✓   |
| FirefoxOS    | html-webview                 | zip      |  ✓  |   ✓   |
| iOS          |                              |          |     |       |
| Ubuntu Touch | html-webview, node, node-sdl | deb, bin |  ✓  |   ✓   |

The iOS Fertilizer has currently no support for cross-compilation
due to XCode limitations. You can still create an own WebView iOS
app and use the `html` platform adapter.

lycheeJS does not ship 32-Bit runtimes in order to save hard disk
space. If you still have a 32-Bit Computer and want to use lycheeJS,
you have to fix (uncomment) at least the
[node/update.sh](https://github.com/Artificial-Engineering/lycheeJS-runtime/blob/master/node/update.sh)
script in the `./bin/runtime` folder and execute it once before
starting the `lycheejs-harvester`.


## Bundle Installation

There are prebuilt bundles that ship all dependencies and
runtimes lycheeJS needs in order to work and cross-compile
properly. These bundles should be installed on the developer's
machine and not on the target platform. Visit [lycheejs.org](http://lycheejs.org)
for a list of available bundles.


## Manual Installation

The netinstall shell script allows to automatically install
lycheeJS on any UNIX-compatible machine (arm or amd64).
The only requirement for the script itself is `curl` and `unzip`.

```bash
sudo mkdir -m 0777 /opt/lycheejs;
cd /opt;

# Install lycheeJS into ./lycheejs
wget -q -O - http://lycheejs.org/download/lycheejs-2015-Q4-netinstall.sh | bash;
```


## Contributor Installation

We love your contributions of any kind. Please consider reading
the [Contribution Guide](./guides/CONTRIBUTION.md) to get
you started in a couple minutes.

```bash
sudo mkdir -m 0777 /opt/lycheejs-edge;
cd /opt/lycheejs-edge;

# Install lycheeJS
git clone https://github.com/Artificial-Engineering/lycheeJS.git ./;
git checkout development;
git clone https://github.com/Artificial-Engineering/lycheeJS-runtime.git ./bin/runtime;

# Run lycheeJS
sudo ./bin/configure.sh;              # use --no-integration if you want a sandboxed installation
lycheejs-harvester start development; # no sudo required
```


## Guides

- [Contribution Guide](./guides/CONTRIBUTION.md)
- [Codestyle Guide](./guides/CODESTYLE.md)
- [Release Guide](./guides/RELEASE.md)


## License

lycheeJS is (c) 2012-2016 Artificial-Engineering and released under MIT / Expat license.
The projects and demos are licensed under CC0 (public domain) license.
The runtimes are owned and copyrighted by their respective owners and may be shipped under a different license.

For further details take a look at the [LICENSE.txt](LICENSE.txt) file.

