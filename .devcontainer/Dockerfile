# Microsoftが提供する言語非依存の標準Ubuntuイメージ
FROM mcr.microsoft.com/devcontainers/base:ubuntu

# 今後Claude Codeがツールをインストールしやすいように、基本パッケージを更新・追加
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
	&& apt-get -y install --no-install-recommends \
	software-properties-common \
	build-essential \
	curl \
	wget \
	git \
	vim \
	&& apt-get clean -y && rm -rf /var/lib/apt/lists/*

# コンテナ起動時のデフォルトユーザーを 'vscode' に指定（root権限はsudoで取得可能）
USER vscode