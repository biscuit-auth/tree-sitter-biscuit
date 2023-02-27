{ pkgs ? import <nixpkgs> {} }: with pkgs;

mkShell {
  buildInputs = [
    pkgconfig
    nodejs
    gcc
    tree-sitter
  ];
}
