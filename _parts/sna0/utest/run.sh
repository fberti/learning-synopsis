set -e; : > /work/full.log
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq r-base libglpk40 > /dev/null
R --version | head -1
cd /work
cat > ~/.Rprofile <<'RP'
options(repos = c(CRAN = "https://p3m.dev/cran/__linux__/noble/latest"))
options(HTTPUserAgent = sprintf("R/%s R (%s)", getRversion(),
  paste(getRversion(), R.version["platform"], R.version["arch"], R.version["os"])))
RP
Rscript -e 'install.packages(c("sna", "igraph", "blockmodeling", "FactoMineR"))' 2>&1 | tail -n 400 >> /work/full.log || true
Rscript -e 'install.packages("xUCINET_0.0.2.0020.tar.gz", repos = NULL, type = "source")' 2>&1 | tail -n 400 >> /work/full.log || true
Rscript -e 'library(xUCINET); print(xDensity(Padgett_FlorentineFamilies$Marriage))'
Rscript -e 'install.packages(c("statnet", "RSiena"))' 2>&1 | tail -n 400 >> /work/full.log || true
Rscript -e 'library(ergm); library(RSiena); cat("ergm", format(packageVersion("ergm")), "RSiena", format(packageVersion("RSiena")), "\n")' 2>&1 | tail -1
