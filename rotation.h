/* turns the input list into an array with the top row composed of ones */
int top(int val, int width);

/* turns the input list into an array with the right row composed of ones */
int right(int val, int width);

/* turns the input list into an array with the bottom row composed of ones */
int bottom(int val, int width, int height);

/* turns the input list into an array with the left row composed of ones */
int left(int val, int width);

/* returns the rotational ring through which a pixel is iterated
unimplemented, but provides the conceptual underpinnings of the larger 
function */
int dist(int val, int width, int height);

/* rotates each value of an array counterclockwise through a ring.
costly, but a switch is infeasible. */
int rotate(int val, int width, int height);

/* given an integer filename with zeroes in empty spaces (ex. 001.ppm),
increases integer filename by 1. Returns error if trying to roll over
a maxed-out file. (ex. 999.ppm) */
char* incrementtext(char *input);

/* takes a ppm image and rotates each pixel around a distance ring.
outputs a new ppm with an incremented filename. Encompasses several
different functions in order to preserve local arrays.
As the rings are rectangular, not circular, does not rotate in a strict
sense, but it is lossless. Currently, the input should be a square
with width of at least 1000 pixels, and a well-formed ppm, with at least
one RGB triplet per line. */
void rotateimage(char *input);

/* recursively iterates rotateimage, applying operation to each output
to magnify effects while leaving intermediate outputs 
ideal for outputting frames of a frame animation */
void rotateimages(char *input, int times);