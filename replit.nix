{
  description = "Node.js environment";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
  };
  outputs = { self, nixpkgs }: {
    devShell = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      buildInputs = with nixpkgs.legacyPackages.x86_64-linux; [
        nodejs-20_x
        nodePackages.npm
      ];
    };
  };
}
