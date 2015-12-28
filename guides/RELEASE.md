
# How to do a lycheeJS Release



## 1. Update the runtimes



All runtimes have to be updated. The `update.sh` inside
the `./bin/runtime` folder updates all runtimes and
downloads their latest stable releases.

The update process itself takes around 20min+, depending
on your bandwidth. The reason for that time span is mostly
bandwidth limitations of the runtime's download servers.

```bash
cd /opt/lycheejs-edge/bin/runtime;
./update.sh;
```



## 2. Fix the Info.plist files for OSX



All OSX Info.plist files contain a `<string>...</string>` tag.
This tag currently is not fixed by the `update.sh` script,
so you have to make sure that every occurance of the name value
is replaced with `__NAME__`.

The two different occurances in the `html-nwjs/osx/x86_64/nwjs.app/Contents/Info.plist`
are listed below:

```html
<key>CFBundleDisplayName</key>
<string>__NAME__</string>

<key>CFBundleName</key>
<string>__NAME__</string>
```



## 3. Release the runtimes



The runtimes are hosted at github, so that a `Contributor Installation`
can still use only github for installing lycheeJS.

```bash
cd /opt/lycheejs-edge/bin/runtime;
rm -rf .git/;
git init;
git remote add origin git@github.com:Artificial-Engineering/lycheeJS-runtime.git;
git add ./;
git commit -m ":sparkles: :boom: :sparkles:";
git push origin master -f;
```



## 4. Release lycheeJS to github



The lycheeJS version flags are used among all bundle-generation algorithms.
That means we have to fix both the `README.md` and the `lychee.js` core.

```bash
VERSION="2016-Q1";


sudo mkdir -m 0777 /opt/lycheejs-release;
cd /opt/lycheejs-release;
git clone git@github.com:Artificial-Engineering/lycheeJS.git ./;
git checkout master;

OLD_HEAD=`git rev-parse HEAD`;
git pull origin development;


# Now merge everything properly into master
# I have no clue how to do this automagically :-/


sed -i 's|2[0-9][0-9][0-9]-Q[1-4]|'$VERSION'|g' ./README.md;
sed -i 's|2[0-9][0-9][0-9]-Q[1-4]|'$VERSION'|g' ./lib/lychee/source/core/lychee.js;

git add ./;
git commit -m "lycheeJS $VERSION release";
git rebase -i $OLD_HEAD;


# Now squash everything into this release and remove the commit messages
# I have no clue how to do this automagically :-/


git push origin master;
```



## 5. Release the lycheeJS bundles



The bundles have to be created on an up-to-date Ubuntu machine.
The `package.sh` inside the root folder creates all bundles. In between
different bundle iterations, the `clean.sh` script has to be executed.

```bash
VERSION="2016-Q1";

sudo apt-get install curl git hfsprogs advancecomp mktorrent;

cd /opt/lycheejs-bundle;

sudo ./clean.sh;
sudo ./package.sh --release $VERSION;

# Alternatively, you can also create a preview release
# sudo ./package.sh --preview $VERSION;

```

Now everything needs to be uploaded to the `lycheeJS-website`, which for
itself has a build bot available and running that does all of the above
steps if commanded to do so.

