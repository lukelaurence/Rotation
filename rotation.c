#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <string.h>
#include "rotation.h"

/* turns the input list into an array with the top row composed of ones */
int top(int val, int width){
    return((int) ceilf(((float) val)/width));
}

/* turns the input list into an array with the right row composed of ones */
int right(int val, int width){
    return(width - ((val - 1) % width));
}

/* turns the input list into an array with the bottom row composed of ones */
int bottom(int val, int width, int height){
    return(height + 1 - ceilf(((float) val)/width));
}

/* turns the input list into an array with the left row composed of ones */
int left(int val, int width){
    return(((val - 1) % width) + 1);
}

/* returns the rotational ring through which a pixel is iterated
unimplemented, but provides the conceptual underpinnings of the larger 
function */
int dist(int val, int width, int height){
    int a;
    int b = 1;
    int min = width;
    if(width > height){
        min = height;
    }
    for(a = 1; a <= (min+1)/2 && b != 0; a = a + 1){
        if(top(val,width) == a || right(val,width) == a || 
        bottom(val,width,height) == a || left(val,width) == a){
            b = 0;
        }
    } return(a);
}

/* rotates each value of an array counterclockwise through a ring.
costly, but a switch is infeasible. */
int rotate(int val, int width, int height){
    int a = 1;
    int b = 1;
    int min = width;
    if(width > height){
        min = height;}
    while(a <= ((min+1)/2) && b != 0){
        if(top(val,width) == a == right(val,width)){
        return(val + width);
        b = 0;
    } else if(bottom(val,width,height) == a == left(val, width)){
        return(val - width);
        b = 0;
    } else if(top(val,width) == a){
        return(val + 1);
        b = 0;
    } else if(bottom(val,width,height) == a){
        return(val - 1);
        b = 0;
    } else if(right(val,width) == a){
        return(val + width);
        b = 0;
    } else if(left(val,width) == a){
        return(val - width);
        b = 0;
    } else a = a + 1;
    }
}

/* given an integer filename with zeroes in empty spaces (ex. 001.ppm),
increases integer filename by 1. Returns error if trying to roll over
a maxed-out file. (ex. 999.ppm) */
char* incrementtext(char *input){
    char *path;
    path = strdup(input);
    int g;
    int h = 1;
    for(g = strlen(input) - 5; g >= 0 && h != 0; g = g - 1){
        if(path[g] != '9'){
            path[g] = (char) (((int) path[g]) + 1);
            h = 0;
        } else {
            path[g] = '0';
            if(g == 0){
                h = 0;
                printf("File not sufficiently long\n");
                exit(1);
            }
        }
    } return path;
}

/* takes a ppm image and rotates each pixel around a distance ring.
outputs a new ppm with an incremented filename. Encompasses several
different functions in order to preserve local arrays.
As the rings are rectangular, not circular, does not rotate in a strict
sense, but it is lossless. Currently, the input should be a square
with width of at least 1000 pixels, and a well-formed ppm, with at least
one RGB triplet per line. */
void rotateimage(char *input){
    char *path;
    char* line = malloc(88 * 4);
    line[5] = 0;
    path = input;
    char* *arr = malloc(3125827 * 352);
    int a = 0;
    int linecount = 0;
    int width,height;
    /* Open file */
    FILE *file1 = fopen(path, "r");
    if(file1 == NULL)
    {
        printf("Error opening file\n");
        exit(1);
    }
    /* Get each line until there are none left */
    printf("scanning file: %s\n", input);
    while(fgets(line, 5, file1)){
        /* Get width and height */
        // height is too irregular to implement currently
        if(linecount == 1){
            width = atoi(line);
            height = width;
        }
        /* Create array of every R, G, or B value */
        if(linecount > 4){
            int f;
            for(f = 0; f <= strlen(line); f = f + 1){
                if(line[f] == '\n'){
                    line[f] = ' ';
                }
            }
        if(strlen(line) >= 3){
        arr[a] = strdup(line);
        a = a + 1;}
        }
        linecount = linecount + 1;
    }
    /* Close file */
    fclose(file1);
    /* Brings the rgb values into rows of 3 */
    printf("merging triplets\n");
    char* *arr2 = malloc(3125827 * 352);
    int d;
    for(d = 0; d < width * height * 3; d = d + 3){
        arr2[d / 3] = strcat(strcat(arr[d],arr[d + 1]), arr[d + 2]);
    }
    /* Rotate array */
    int b;
    char* *arr3 = malloc(3125827 * 352);
    printf("rotating array\n");
    for(b = 0; b < width * height; b = b + 1){
        arr3[b] = arr2[rotate(b + 1, width, height) - 1];
    }
    /* Output file */
    char *path2;
    path2 = strdup(path);
    path2 = incrementtext(input);
    FILE *file2 = fopen(path2, "w");
    printf("printing to %s\n", path2);
    fprintf(file2, "P3\n%d %d\n255\n",width,height);
    int c;
    for(c = 0; c < width * height; c = c + 1){
        fprintf(file2, "%s\n",arr3[c]);
    }
    fclose(file2);
    free(line);
    free(arr);
    free(arr2);
    free(arr3);
    printf("process complete\n");
}

/* recursively iterates rotateimage, applying operation to each output
to magnify effects while leaving intermediate outputs 
ideal for outputting frames of a frame animation */
void rotateimages(char *input, int times){
    if(times > 0){
        rotateimage(input);
        rotateimages(incrementtext(input),times - 1);
    }
}