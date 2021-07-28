#include <iostream>
using namespace std;

// not using string
void duplicateStr(char str[]){
	int n=0,i=0;
	char s[20];
	while (str[i] != '\0'){
		++n;
		s[i] = str[i];
		++i;
	}
	for (i=0;i<n;i++){
		s[i+n] = str[i];
	}
    cout << "duplicated: " << s << endl;
}

void reverseStr(char str[])
{
    cout << "reversed: " << str << endl;
}


int main(){
	char str[] = "abcdefg";
 	duplicateStr(str);
 	reverseStr(str);
	return 0;
}
