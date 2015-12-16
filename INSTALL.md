sudo mkdir -m 0777 /opt/lycheejs-edge;
cd /opt/lycheejs-edge;

git clone https://github.com/Artificial-Engineering/lycheeJS.git ./;
git checkout development;

git clone https://github.com/Artificial-Engineering/lycheeJS-runtime.git ./bin/runtime;

sudo ./bin/configure.sh;           # use --no-integration if you want a sandboxed installation
./bin/sorbet.sh start development; # no sudo required
