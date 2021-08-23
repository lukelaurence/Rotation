#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <string.h>
#include "rotation.h"

int main(int argc, char** argv){
    char* a = "0000.ppm";
    if(argc > 1){
        a = strcat(argv[1],".ppm");}
    int b = 1000;
    if(argc > 2 && atoi(argv[2]) != 0){
        b = atoi(argv[2]);}
    rotateimages(a,b);
    return 0;
}