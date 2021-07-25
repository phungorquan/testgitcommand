#include <iostream>
using namespace std;

// not using string
void duplicateStr(char str[])
{
    cout << "duplicated: " << str << endl;
}

void reverseStr(char str[])
{
    cout << "reversed: " << str << endl;
}

int main(){
	char str[] = "lora^^";
 	duplicateStr(str);
 	reverseStr(str);
	return 0;
}
