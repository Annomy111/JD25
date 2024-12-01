{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.typescript-language-server
    pkgs.yarn
    pkgs.nodePackages.npm
  ];
  env = {
    LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
      pkgs.libuuid
    ];
  };
}
