rotation: rotation.h rotation.c main_rotation.c
		clang -Wall -lm -o rotation rotation.c main_rotation.c
clean:
		rm -f rotation *.o *~