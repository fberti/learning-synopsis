set -e
export DEBIAN_FRONTEND=noninteractive
: > /work/full.log
apt-get update -qq
apt-get install -y -qq --no-install-recommends software-properties-common dirmngr wget ca-certificates > /dev/null
wget -qO- https://cloud.r-project.org/bin/linux/ubuntu/marutter_pubkey.asc | tee -a /etc/apt/trusted.gpg.d/cran_ubuntu_key.asc > /dev/null
add-apt-repository -y "deb https://cloud.r-project.org/bin/linux/ubuntu $(lsb_release -cs)-cran40/" > /dev/null
apt-get install -y -qq --no-install-recommends r-base libglpk40 > /dev/null
R --version | head -1
cd /work
cat > ~/.Rprofile <<'RP'
options(repos = c(CRAN = "https://p3m.dev/cran/__linux__/noble/latest"))
options(HTTPUserAgent = sprintf("R/%s R (%s)", getRversion(),
  paste(getRversion(), R.version["platform"], R.version["arch"], R.version["os"])))
RP
Rscript -e 'install.packages(c("sna", "igraph", "blockmodeling", "FactoMineR"))' >> /work/full.log 2>&1 || true
Rscript -e 'install.packages("xUCINET_0.0.2.0020.tar.gz", repos = NULL, type = "source")' >> /work/full.log 2>&1 || true
Rscript -e 'library(xUCINET); xDensity(Padgett_FlorentineFamilies$Marriage); xDensity(Krackhardt_HighTech$Advice)'
Rscript -e 'install.packages(c("statnet", "RSiena"))' >> /work/full.log 2>&1 || true
Rscript -e 'library(ergm); library(RSiena); packageVersion("ergm"); packageVersion("RSiena")' 2>&1 | tail -2
