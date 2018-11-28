#!/user/bin/python3.7.0

# Imports
import sys
import json
import os


#global id counter
myId = 1

def path_to_dict(path):
    global myId

    d = {'name': os.path.basename(path)}
    d['id'] = myId
    myId += 1 

    if os.path.isdir(path):
        d['type'] = "directory"
        d['children'] = [path_to_dict(os.path.join(path,x)) for x in os.listdir(path)]
    else:
        d['type'] = "file"

    return d



def main():
    try:



        #with open("file.json", "r") as read_file:
        #    data = json.load(read_file)

        #print(data["children"][0]["children"])
        #for x in data:
        #    print(x)


        data = (json.dumps(path_to_dict('/Users/pboutet/Downloads/544/Computer')))
        print(data)
        print(myId)

        #with open("test1.json", "w") as write_file:
        #    json.dump(data, write_file)

        

    except Exception:
        sys.exit(1)





# Main body
if __name__ == '__main__':
    main()