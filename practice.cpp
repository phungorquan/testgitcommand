#include <iostream>
using namespace std;

int getStrLen(char str[]){
    int len = 0;
    while (str[len] != '\0')
    {
        len++;
    }
    return len;
}

// not using string
void duplicateStr(char str[])
{
    unsigned int n = 2;
    unsigned int len = getStrLen(str);
    unsigned char dupStr[len*n];
    unsigned int strIndex = 0, dupStrIndex = 0;
    for (int i = 1; i <= n; i++)
    {
    	unsigned int maxStrLen = len*i;
        for (dupStrIndex; dupStrIndex < maxStrLen; dupStrIndex++)
        {
            dupStr[dupStrIndex] = str[strIndex];
            strIndex++;
        }
        dupStrIndex = maxStrLen;
        strIndex = 0;
    }
    
    cout << "duplicated: " << dupStr << endl;
}

void reverseStr(char str[])
{
    unsigned int len = getStrLen(str);
    unsigned char reverseStr[len];
    unsigned int indexReverseStr = len - 1;
    
    for (int i = 0 ; i < len; i++)
    {
        reverseStr[i] = str[indexReverseStr];
        indexReverseStr--;
    }
    
    cout << "reversed: " << reverseStr << endl;
}


int main(){
	char str[] = "abcdefg";
 	duplicateStr(str);
 	reverseStr(str);
	return 0;
}