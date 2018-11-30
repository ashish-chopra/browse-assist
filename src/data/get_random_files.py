#!/user/bin/python3.7.0
# Takes 1 argument
#   1: path to directory
#
import os, random, sys

def get_random_files(root, target_depth, depth=1):
    items = []
    for item in os.listdir(root): 
        path = os.path.join(root, item)
        if os.path.isdir(path):
            items += get_random_files(path, target_depth, depth + 1)
        if target_depth == depth and not os.path.isdir(path):
            items.append(item)
    return items

def main(path, depth):
    needed_files = 6
    haystack = get_random_files(path, depth)
    needles = random.sample(haystack, needed_files)
    print("Displaying %d/%d" % (len(needles), len(haystack)))
    for i in range(len(needles)):
        print("%d: %s" % (i + 1, needles[i]))

# Main body
if __name__ == '__main__':
    root = sys.argv[1]
    depth = 3
    main(root, depth)
