
## Projects Folder

This folder contains all projects made with lycheeJS. It already
contains many examples and demos that you can open, edit and
manipulate with the lycheeJS tools.



### Initialize a Project

You can initialize a project using the `lycheejs-reeder`.
The `lycheejs-breeder` allows to manage your projects and its
libraries as dependencies.


```bash
cd /opt/lycheejs;
mkdir ./projects/my-project;
cd ./projects/my-project;

# Initialize the isomorphic Boilerplate
lycheejs-breeder init;
```

If you want to isolate your library dependencies, you can
pull them in. The dependency tree is automatically shrinked
down to its minimum.
This allows deploying your App to other system where there's
no `lycheejs-harvester` available.

```bash
cd /opt/lycheejs;
cd ./projects/my-project;

# Pull (isolate) the lychee library
lycheejs-breeder pull /libraries/lychee;
```

